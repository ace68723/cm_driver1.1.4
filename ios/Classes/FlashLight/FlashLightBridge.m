//
//  FlashLightBridge.m
//  cm_driver
//
//  Created by yicheng huang on 2016-11-21.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "FlashLightBridge.h"

#import <AVFoundation/AVFoundation.h>
#import "AudioToolbox/AudioToolbox.h"

@implementation FlashLightBridge

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(open)
{
  AudioServicesPlaySystemSound(kSystemSoundID_Vibrate);
//  AVCaptureDevice * device = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
//  //修改前必须先锁定
//  [device lockForConfiguration:nil];
//  //必须判定是否有闪光灯，否则如果没有闪光灯会崩溃
//  if ([device hasFlash]) {
//      AudioServicesPlaySystemSound(kSystemSoundID_Vibrate);
//    if(device.torchMode == AVCaptureTorchModeOff){
//      [device setTorchMode:AVCaptureTorchModeOn];
//      [device setFlashMode:AVCaptureFlashModeOn];
//    }else{
//      [device setTorchMode:AVCaptureTorchModeOff];
//      [device setFlashMode:AVCaptureFlashModeOff];
//    }
//    
//  } else {
//    
//    NSLog(@"设备不支持闪光灯");
//  }
//  [device unlockForConfiguration];
}
RCT_EXPORT_METHOD(close)
{
//  AVCaptureDevice * device = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
//  [device lockForConfiguration:nil];
//   if ([device hasFlash]) {
//     [device setTorchMode:AVCaptureTorchModeOff];
//     [device setFlashMode:AVCaptureFlashModeOff];
//   }
}

@end
