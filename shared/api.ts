/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Bundle Details API Types
 */
export interface BundleDetailsRequest {
  nccId: string;
}

export interface BundleDetailsResponse {
  result?: BundleInfo;
  error?: string;
}

export interface BundleInfo {
  // Basic Bundle Information
  name: string;
  description?: string;
  queueId: string;
  maxRenewals: number;
  fee: number;
  id: string;
  customData: Record<string, any>;

  // Period Lifecycle Information
  plc?: PeriodLifecycleInfo;

  // Charging Logic
  chargingLogic?: ChargingLogicInfo[];
}

export interface PeriodLifecycleInfo {
  name: string;
  periodType: string; // timeUnit
  periodLength: number;
  states: LifecycleState[];
}

export interface LifecycleState {
  name: string;
  actions: LifecycleAction[];
}

export interface LifecycleAction {
  type: string;
  defaultValues: Record<string, any>;
  notificationTemplateId?: string; // for SendNotificationAction
}

export interface ChargingLogicInfo {
  clName: string;
  bucket: string;
  initialValue: number;
  bucketType: string;
  thresholdProfileGroupId: string;
  isCarryOver: boolean;
}

export interface NotificationMessagesRequest {
  nccId: string;
  notificationId: string;
}

export interface NotificationMessagesResponse {
  messagesByChannel: Record<string, string[]>; // Currently supports "SMS" and "Kafika" channels, each with 6 language messages: English, Amharic, Oromo, Tigrinya, Somali, Afar
  nccId: string;
  notificationId: string;
}

export interface SubscribeBundleRequest {
  msisdn: string;
  nccId: string;
}

export interface SubscribeBundleResponse {
  success: boolean;
  message: string;
  subscriptionId?: string;
}
