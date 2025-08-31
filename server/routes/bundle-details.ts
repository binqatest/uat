import { RequestHandler } from "express";
import {
  BundleDetailsRequest,
  BundleDetailsResponse,
  BundleInfo,
  NotificationMessagesRequest,
  NotificationMessagesResponse,
  SubscribeBundleRequest,
  SubscribeBundleResponse,
} from "@shared/api";

export const getBundleDetails: RequestHandler = (req, res) => {
  const { nccId } = req.query as { nccId: string };

  if (!nccId) {
    const response: BundleDetailsResponse = {
      error: "NCC ID is required",
    };
    return res.status(400).json(response);
  }

  // Simulate database lookup
  if (Math.random() < 0.1) {
    // 10% chance of not found
    const response: BundleDetailsResponse = {
      error: `Bundle with NCC ID "${nccId}" not found`,
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
      category: nccId.startsWith("CBU")
        ? "Core Banking"
        : nccId.startsWith("EBU")
          ? "Electronic Banking"
          : nccId.startsWith("MPE")
            ? "M-PESA"
            : "Standard",
      ...(Math.random() > 0.3
        ? {
            specialFeature: "Premium Access",
            allocatedBandwidth: `${Math.floor(Math.random() * 1000) + 100} Mbps`,
          }
        : {}),
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
                currency: "KES",
              },
            },
            {
              type: "SendNotificationAction",
              defaultValues: {
                template: "activation_success",
                channel: "SMS",
              },
              notificationTemplateId: `NOTIF_${Math.floor(Math.random() * 1000)}`,
            },
          ],
        },
        {
          name: "EXPIRED",
          actions: [
            {
              type: "SendNotificationAction",
              defaultValues: {
                template: "bundle_expired",
                channel: "SMS",
              },
              notificationTemplateId: `NOTIF_${Math.floor(Math.random() * 1000)}`,
            },
          ],
        },
        {
          name: "SUSPENDED",
          actions: [
            {
              type: "BlockAction",
              defaultValues: {
                reason: "Insufficient balance",
              },
            },
          ],
        },
      ],
    },
    chargingLogic: [
      {
        clName: `CL_${nccId}_DATA`,
        bucket: `BUCKET_DATA_${nccId}`,
        initialValue: Math.floor(Math.random() * 5000) + 1000,
        bucketType: "DATA_MB",
        thresholdProfileGroupId: `THR_GRP_${Math.floor(Math.random() * 100)}`,
        isCarryOver: Math.random() > 0.5,
      },
      {
        clName: `CL_${nccId}_VOICE`,
        bucket: `BUCKET_VOICE_${nccId}`,
        initialValue: Math.floor(Math.random() * 300) + 50,
        bucketType: "VOICE_MINUTES",
        thresholdProfileGroupId: `THR_GRP_${Math.floor(Math.random() * 100)}`,
        isCarryOver: Math.random() > 0.3,
      },
      ...(Math.random() > 0.4
        ? [
            {
              clName: `CL_${nccId}_SMS`,
              bucket: `BUCKET_SMS_${nccId}`,
              initialValue: Math.floor(Math.random() * 100) + 10,
              bucketType: "SMS_COUNT",
              thresholdProfileGroupId: `THR_GRP_${Math.floor(Math.random() * 100)}`,
              isCarryOver: false,
            },
          ]
        : []),
    ],
  };

  const response: BundleDetailsResponse = {
    result: bundleInfo,
  };

  res.json(response);
};

export const getNotificationMessages: RequestHandler = (req, res) => {
  const { nccId, notificationId } = req.query as {
    nccId: string;
    notificationId: string;
  };

  if (!nccId || !notificationId) {
    return res.status(400).json({
      error: "Both NCC ID and Notification ID are required",
    });
  }

  // Generate messages for each language
  const generateSMSMessages = (nccId: string) => ({
    English: `Dear customer, your ${nccId} bundle has been activated successfully.`,
    Amharic: `ውድ ደንበኛ፣ የእርስዎ ${nccId} ጥቅል በተሳካ ሁኔታ ተነቅቷል።`,
    Oromo: `Maamila jaalala, paakeejiin ${nccId} keessan milkaa'inaan hojjetameera.`,
    Tigrinya: `ውድ ዓሚል፣ እቲ ${nccId} ፓኬጅኩም ብዓወት ተቐስቢሩ።`,
    Somali: `Macamiil qaaliga ah, xirmada ${nccId} ayaa si guul leh loo hawlgeliyay.`,
    Afar: `Yaabat maali, ${nccId} garbak-t raha oofin-t waqay.`,
  });

  const generateKafikaMessages = (nccId: string) => ({
    English: `Notification: Your ${nccId} bundle is ready. Check balance with *123#.`,
    Amharic: `ማሳወቂያ፡ የእርስዎ ${nccId} ጥቅል ዝግጁ ነው። ሚዛኑን በ*123# ይመልከቱ።`,
    Oromo: `Beeksisa: Paakeejiin ${nccId} keessan qophaa'eera. Madaala *123# tiin ilaalaa.`,
    Tigrinya: `መግለጺ፡ እቲ ${nccId} ፓኬጅኩም ድሉው እዩ። ሚዛን ብ*123# ተዓዘብዎ።`,
    Somali: `Ogeysiis: Xirmada ${nccId} ayaa diyaar. Miisaanka *123# ku eeg.`,
    Afar: `Maatit: ${nccId} garbak-t digay. Miisan-t *123# teela.`,
  });

  const response: NotificationMessagesResponse = {
    nccId,
    notificationId,
    messagesByChannel: {
      SMS: Object.values(generateSMSMessages(nccId)),
      Kafika: Object.values(generateKafikaMessages(nccId)),
    },
  };

  res.json(response);
};

export const subscribeBundle: RequestHandler = (req, res) => {
  const { msisdn, nccId } = req.body as SubscribeBundleRequest;

  // Validation
  if (!msisdn || !nccId) {
    const response: SubscribeBundleResponse = {
      success: false,
      message: "MSISDN and NCC ID are required",
    };
    return res.status(400).json(response);
  }

  // Validate MSISDN format (simple validation)
  const msisdnRegex = /^[0-9]{10,15}$/;
  if (!msisdnRegex.test(msisdn)) {
    const response: SubscribeBundleResponse = {
      success: false,
      message: "Invalid MSISDN format. Please enter a valid phone number.",
    };
    return res.status(400).json(response);
  }

  // Simulate subscription process
  if (Math.random() < 0.15) {
    // 15% chance of failure
    const response: SubscribeBundleResponse = {
      success: false,
      message:
        "Subscription failed. Insufficient balance or bundle not available.",
    };
    return res.status(422).json(response);
  }

  const response: SubscribeBundleResponse = {
    success: true,
    message: `Bundle ${nccId} successfully subscribed for MSISDN ${msisdn}`,
    subscriptionId: `SUB_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
  };

  res.json(response);
};
