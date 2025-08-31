import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Home, Bell, AlertCircle, ExternalLink, Package } from "lucide-react";
import { NotificationMessagesResponse } from "@shared/api";

export default function MessagesTemplate() {
  const [searchParams] = useSearchParams();
  const nccId = searchParams.get("nccId") || "";
  const notificationId = searchParams.get("notificationId") || "";

  const [messages, setMessages] = useState<NotificationMessagesResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (nccId && notificationId) {
      fetchMessages();
    }
  }, [nccId, notificationId]);

  const fetchMessages = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/notification-messages?nccId=${encodeURIComponent(nccId)}&notificationId=${encodeURIComponent(notificationId)}`,
      );
      const data = await response.json();

      if (response.ok) {
        setMessages(data);
      } else {
        setError(data.error || "Failed to fetch notification messages");
      }
    } catch (err) {
      setError("Failed to fetch notification messages");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/bundle_info"
                className="flex items-center gap-1"
              >
                <Package className="h-4 w-4" />
                Bundle Details
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Messages Template</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Messages Template
          </h1>
          <p className="text-muted-foreground">
            Display messages associated with a specific notification template,
            grouped by channel
          </p>
        </div>

        {/* Header Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Template Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">NCC ID:</span>
                <Link
                  to={`/bundle_info?nccId=${encodeURIComponent(nccId)}`}
                  className="inline-flex items-center gap-1 text-brand hover:text-brand-600 underline"
                >
                  <Badge variant="outline">{nccId}</Badge>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Notification ID:</span>
                <Badge variant="secondary">{notificationId}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Loading messages...
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Messages Display */}
        {messages && !loading && (
          <div className="space-y-4">
            {Object.entries(messages.messagesByChannel).length > 0 ? (
              Object.entries(messages.messagesByChannel).map(
                ([channel, channelMessages]) => {
                  // Language mapping for display
                  const languages = [
                    "English",
                    "Amharic",
                    "Oromo",
                    "Tigrinya",
                    "Somali",
                    "Afar",
                  ];

                  return (
                    <Card key={channel} className="shadow-md">
                      <CardHeader className="border-l-4 border-l-brand bg-gradient-to-r from-brand/5 to-transparent">
                        <CardTitle className="flex items-center gap-2">
                          <Bell className="h-5 w-5" />
                          {channel} Channel
                        </CardTitle>
                        <CardDescription>
                          Messages in {channelMessages.length} language
                          {channelMessages.length !== 1 ? "s" : ""} - (
                          {languages
                            .slice(0, channelMessages.length)
                            .join(", ")}
                          )
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {channelMessages.map((message, index) => {
                            const language =
                              languages[index] || `Language ${index + 1}`;
                            const languageColors = {
                              English:
                                "bg-blue-100 text-blue-800 border-blue-200",
                              Amharic:
                                "bg-green-100 text-green-800 border-green-200",
                              Oromo:
                                "bg-yellow-100 text-yellow-800 border-yellow-200",
                              Tigrinya:
                                "bg-purple-100 text-purple-800 border-purple-200",
                              Somali:
                                "bg-orange-100 text-orange-800 border-orange-200",
                              Afar: "bg-red-100 text-red-800 border-red-200",
                            };

                            return (
                              <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Badge
                                    variant="outline"
                                    className={`${languageColors[language as keyof typeof languageColors] || "bg-gray-100 text-gray-800"} font-medium`}
                                  >
                                    {language}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {channel} Template
                                  </span>
                                </div>
                                <Textarea
                                  value={message}
                                  readOnly
                                  className="min-h-[100px] resize-none bg-muted/30 border-muted text-sm"
                                  placeholder="No message content"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                },
              )
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No messages found for this notification template.</p>
                    <p className="text-sm mt-1">
                      The template may not have any configured messages or the
                      template ID may be invalid.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Information Section for Empty States */}
        {!nccId || !notificationId ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Template Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• Valid NCC ID parameter required</p>
                  <p>• Valid Notification ID parameter required</p>
                  <p>• Access via Bundle Details → Lifecycle</p>
                  <p>• Click notification template links</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Supported Channels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    <strong>SMS</strong> - Text message notifications
                  </p>
                  <p>
                    <strong>Kafika</strong> - Kafika platform messages
                  </p>
                  <Separator className="my-2" />
                  <p className="font-medium">Languages:</p>
                  <div className="grid grid-cols-2 gap-1 ml-2">
                    <p>• English</p>
                    <p>• Amharic</p>
                    <p>• Oromo</p>
                    <p>• Tigrinya</p>
                    <p>• Somali</p>
                    <p>• Afar</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
