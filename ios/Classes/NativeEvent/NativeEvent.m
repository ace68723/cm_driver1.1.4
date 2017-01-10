//
//  NativeEvent.m
//  ruirui
//
//  Created by yicheng huang on 2016-09-06.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "NativeEvent.h"

static NSString *ADNotification = @"com.cm_driver.app.nativeEvent";

@implementation NativeEvent
@synthesize bridge = _bridge;
RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[@"NativeEvent"];
}
RCT_EXPORT_METHOD(AddEventListener){
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(sendEventToJS:)
                                               name:ADNotification
                                             object:nil];
}

- (void)sendEventToJS:(NSNotification *)note {
  [self sendEventWithName:@"NativeEvent" body:note.userInfo];
}

@end
