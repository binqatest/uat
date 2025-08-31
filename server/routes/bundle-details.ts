import { RequestHandler } from "express";
import { 
  BundleDetailsRequest, 
  BundleDetailsResponse, 
  BundleInfo,
  NotificationMessagesRequest,
  NotificationMessagesResponse,
  SubscribeBundleRequest,
  SubscribeBundleResponse
} from "@shared/api";

export const getBundleDetails: RequestHandler = (req, res) => {
  const { nccId } = req.query as { nccId: string };

  if (!nccId) {
    const response: BundleDetailsResponse = {
      error: "NCC ID is required"
    };
    return res.status(400).json(response);
  }

  // Simulate database lookup
  if (Math.random() < 0.1) { // 10% chance of not found
    const response: BundleDetailsResponse = {
      error: `Bundle with NCC ID "${nccId}" not found`
    };
    return res.status(404).json(response);
  }

  // Mock bundle data generation
  const bundleInfo: BundleInfo = {
    name: `Bundle ${nccId}`,
    description: `Comprehensive ${nccId} bundle with advanced features`,
    queueId: `QUEUE_${nccId}_${Math.floor(Math.random() * 1000)}`,
    maxRenewals: Math.floor(Math.random() * 5) + 1,
    fee: Math.floor(Math.random() * 500) + 50,
    id: `ID_${nccId}_${Date.now()}`,
    customData: {
      region: Math.random() > 0.5 ? "East Africa" : "West Africa",
      priority: Math.random() > 0.5 ? "High" : "Standard",
      category: nccId.startsWith('CBU') ? 'Core Banking' : 
               nccId.startsWith('EBU') ? 'Electronic Banking' :
               nccId.startsWith('MPE') ? 'M-PESA' : 'Standard',
      ...(Math.random() > 0.3 ? { 
        specialFeature: "Premium Access",
        allocatedBandwidth: `${Math.floor(Math.random() * 1000) + 100} Mbps`
      } : {})
    },
    plc: {
      name: `PLC_${nccId}`,
      periodType: Math.random() > 0.5 ? "DAYS" : "HOURS",
      periodLength: Math.random() > 0.5 ? 30 : 24,
      states: [
        {
          name: "ACTIVE",
          actions: [
            {
              type: "ChargeAction",
              defaultValues: {
                amount: Math.floor(Math.random() * 100) + 10,
                currency: "KES"
              }
            },
            {
              type: "SendNotificationAction",
              defaultValues: {
                template: "activation_success",
                channel: "SMS"
              },
              notificationTemplateId: `NOTIF_${Math.floor(Math.random() * 1000)}`
            }
          ]
        },
        {
          name: "EXPIRED",
          actions: [
            {
              type: "SendNotificationAction", 
              defaultValues: {
                template: "bundle_expired",
                channel: "SMS"
              },
              notificationTemplateId: `NOTIF_${Math.floor(Math.random() * 1000)}`
            }
          ]
        },
        {
          name: "SUSPENDED",
          actions: [
            {
              type: "BlockAction",
              defaultValues: {
                reason: "Insufficient balance"
              }
            }
          ]
        }
      ]
    },
    chargingLogic: [
      {
        clName: `CL_${nccId}_DATA`,
        bucket: `BUCKET_DATA_${nccId}`,
        initialValue: Math.floor(Math.random() * 5000) + 1000,
        bucketType: "DATA_MB",
        thresholdProfileGroupId: `THR_GRP_${Math.floor(Math.random() * 100)}`,
        isCarryOver: Math.random() > 0.5
      },
      {
        clName: `CL_${nccId}_VOICE`,
        bucket: `BUCKET_VOICE_${nccId}`,
        initialValue: Math.floor(Math.random() * 300) + 50,
        bucketType: "VOICE_MINUTES",
        thresholdProfileGroupId: `THR_GRP_${Math.floor(Math.random() * 100)}`,
        isCarryOver: Math.random() > 0.3
      },
      ...(Math.random() > 0.4 ? [{
        clName: `CL_${nccId}_SMS`,
        bucket: `BUCKET_SMS_${nccId}`,
        initialValue: Math.floor(Math.random() * 100) + 10,
        bucketType: "SMS_COUNT",
        thresholdProfileGroupId: `THR_GRP_${Math.floor(Math.random() * 100)}`,
        isCarryOver: false
      }] : [])
    ]
  };

  const response: BundleDetailsResponse = {
    result: bundleInfo
  };

  res.json(response);
};

export const getNotificationMessages: RequestHandler = (req, res) => {
  const { nccId, notificationId } = req.query as { nccId: string; notificationId: string };

  if (!nccId || !notificationId) {
    return res.status(400).json({
      error: "Both NCC ID and Notification ID are required"
    });
  }

  const response: NotificationMessagesResponse = {
    nccId,
    notificationId,
    messagesByChannel: {
      SMS: [
        `Dear customer, your ${nccId} bundle has been activated successfully.`,
        `You have remaining balance in your ${nccId} bundle. Check *123# for details.`
      ],
      Email: [
        `Your ${nccId} bundle subscription is now active. Thank you for choosing our services.`
      ],
      Push: [
        `${nccId} Bundle Activated`,
        `Bundle ${nccId} expires in 30 days`
      ],
      ...(Math.random() > 0.5 ? {
        USSD: [`*123*${nccId}# - Check bundle status`]
      } : {})
    }
  };

  res.json(response);
};

export const subscribeBundle: RequestHandler = (req, res) => {
  const { msisdn, nccId } = req.body as SubscribeBundleRequest;

  // Validation
  if (!msisdn || !nccId) {
    const response: SubscribeBundleResponse = {
      success: false,
      message: "MSISDN and NCC ID are required"
    };
    return res.status(400).json(response);
  }

  // Validate MSISDN format (simple validation)
  const msisdnRegex = /^[0-9]{10,15}$/;
  if (!msisdnRegex.test(msisdn)) {
    const response: SubscribeBundleResponse = {
      success: false,
      message: "Invalid MSISDN format. Please enter a valid phone number."
    };
    return res.status(400).json(response);
  }

  // Simulate subscription process
  if (Math.random() < 0.15) { // 15% chance of failure
    const response: SubscribeBundleResponse = {
      success: false,
      message: "Subscription failed. Insufficient balance or bundle not available."
    };
    return res.status(422).json(response);
  }

  const response: SubscribeBundleResponse = {
    success: true,
    message: `Bundle ${nccId} successfully subscribed for MSISDN ${msisdn}`,
    subscriptionId: `SUB_${Date.now()}_${Math.floor(Math.random() * 1000)}`
  };

  res.json(response);
};
