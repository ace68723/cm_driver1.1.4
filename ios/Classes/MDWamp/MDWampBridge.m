//
//  MDWampBridge.m
//  cm_driver
//
//  Created by yicheng huang on 2016-10-25.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "MDWampBridge.h"
#import "MDWamp.h"

static NSString *ADNotification = @"com.cm_driver.app.nativeEvent";

@interface  MDWampBridge()
@property (strong, nonatomic) MDWamp *wampConnection;
@property (strong, nonatomic) NSString *driver_id;

@end

@implementation MDWampBridge
RCT_EXPORT_MODULE();

//start set connection
RCT_EXPORT_METHOD(startMDWamp: (NSString *) token){
  MDWampTransportWebSocket *websocket = [[MDWampTransportWebSocket alloc]
                                         initWithServer:[NSURL URLWithString:@"ws://wsdriver.chanmao.ca:7474"]
                                         protocolVersions:@[kMDWampProtocolWamp2msgpack, kMDWampProtocolWamp2json]];
  
  _wampConnection = [[MDWamp alloc]
                     initWithTransport:websocket
                     realm:@"realm2"
                     delegate:self];
  
  MDWampClientConfig *conf = [[MDWampClientConfig alloc] init];
  conf.authmethods = @[kMDWampAuthMethodCRA];
  conf.authid = @"123";
  conf.sharedSecret = @"123";

  [conf setDeferredWampCRASigningBlock:^(NSString *challange, void(^finishBLock)(NSString *signature) ) {
    NSLog(@"challange%@",challange);
    finishBLock(token);
  }];
  
  [_wampConnection setConfig:conf];
  [_wampConnection connect];

}

// Connection Established event
- (void) mdwamp:(MDWamp*)wamp sessionEstablished:(NSDictionary*)info{
  
  _driver_id =[[info objectForKey:@"data"] objectForKey:@"driver_id"];
  
  [_wampConnection subscribe:_driver_id onEvent:^(MDWampEvent *payload) {
    NSMutableDictionary *data = [payload.arguments[0] mutableCopy];
    [data setValue:@"MDWamp" forKey:@"type"];
    [[NSNotificationCenter defaultCenter] postNotificationName:ADNotification
                                                        object:nil
                                                      userInfo:data];
  } result:^(NSError *error) {
    // 判断 error==nil
    //NSLog(@"subscribe ok? %@", (error==nil)?@"YES":@"NO");
    
    NSMutableDictionary *data = [@{@"driver_id" : _driver_id,
                                   @"type":@"MDWamp",
                                   @"scenario":@"subscribed"
                                   } mutableCopy];
//    [data setValue:@"MDWamp" forKey:@"type"];
//    [data setValue:@"subscribed" forKey:@"scenario"];
    
    if(error == nil){
      [[NSNotificationCenter defaultCenter] postNotificationName:ADNotification
                                                          object:nil
                                                        userInfo:data];
    }else{
      [[NSNotificationCenter defaultCenter] postNotificationName:ADNotification
                                                          object:nil
                                                        userInfo:@{
                                                                    @"result":@1,
                                                                      @"type":@"MDWamp",
                                                                    @"MDWampType":@"sessionEstablished",
                                                                   @"message":error,
                                                                      @"data":@""
                                                                   }];
    }
  }];
};


// Connection Close event
- (void) mdwamp:(MDWamp *)wamp closedSession:(NSInteger)code reason:(NSString*)reason details:(NSDictionary *)details{
  //code 0: authentication_failure
  //reason:"thruway.error.authentication_failure"
  NSLog(@"code: %ld",(long)code);
  NSLog(@"%@",details);
  NSLog(@"%@",reason);
  if([reason  isEqual: @"thruway.error.authentication_failure"]){
    NSLog(@"auth fail");
  }
  NSMutableDictionary *data = [@{@"result" : @1,
                                 @"type":@"MDWamp",
                                 @"scenario":@"closedSession",
                                 @"reason":reason,
                                 @"data":@""
                                 } mutableCopy];
  [[NSNotificationCenter defaultCenter] postNotificationName:ADNotification
                                                      object:nil
                                                    userInfo:data];
}


RCT_EXPORT_METHOD(
                  call:(NSString *) topic
                  ia_data:(NSArray *)ia_data
                  ){
  [_wampConnection call:topic args:ia_data  kwArgs:nil options:nil complete:^(MDWampResult *result, NSError *error) {
    if (error== nil) {
      NSMutableDictionary *data = [result.arguments[0] mutableCopy];
      [data setValue:@"MDWamp" forKey:@"type"];
      [data setValue:topic forKey:@"scenario"];
      [[NSNotificationCenter defaultCenter] postNotificationName:ADNotification
                                                          object:nil
                                                        userInfo:data];
    } else {
      NSLog(@"call error %@",error);
      // handle the error
      [[NSNotificationCenter defaultCenter] postNotificationName:ADNotification
                                                          object:nil
                                                        userInfo:@{
                                                                    @"result":@1,
                                                                   @"message":error,
                                                                    @"MDWampType":@"call",
                                                                      @"type":@"MDWamp",
                                                                      @"data":@""
                                                                   }];

    }
  }];
}


RCT_EXPORT_METHOD(disconnect){
  [_wampConnection disconnect];
}
@end
