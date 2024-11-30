#include <WiFi.h>
#include <esp_now.h>

typedef struct struct_message
{
    float temperature;
    float humidity;
    int soilMoisture;
} struct_message;

typedef struct struct_response
{
    int led;
} struct_response;

struct_message incomingData;
struct_response responseData;

uint8_t controllerMAC[] = {0x94, 0xB9, 0x7E, 0xC4, 0xA7, 0x3C};

void onDataReceive(const esp_now_recv_info *info, const uint8_t *data, int len)
{
    Serial.println("Data received from controller");
    memcpy(&incomingData, data, sizeof(incomingData));

    Serial.print("{ \"temperature\": ");
    Serial.print(incomingData.temperature);
    Serial.print(", \"humidity\": ");
    Serial.print(incomingData.humidity);
    Serial.print(", \"soilMoisture\": ");
    Serial.print(incomingData.soilMoisture);
    Serial.println(" }");

    Serial.println("Enter response data:");
}

void onDataSent(const uint8_t *mac_addr, esp_now_send_status_t status)
{
    Serial.print("Delivery status: ");
    Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Success" : "Fail");
}

void setup()
{
    Serial.begin(115200);

    WiFi.mode(WIFI_STA);
    if (esp_now_init() != ESP_OK)
    {
        Serial.println("Error initializing ESP-NOW");
        return;
    }

    esp_now_peer_info_t peerInfo;
    memcpy(peerInfo.peer_addr, controllerMAC, 6);
    peerInfo.channel = 0;
    peerInfo.encrypt = false;
    if (esp_now_add_peer(&peerInfo) != ESP_OK)
    {
        Serial.println("Failed to add peer");
        return;
    }

    responseData.led = 1;

    esp_now_register_send_cb(onDataSent);
    esp_now_register_recv_cb(onDataReceive);
    Serial.println(WiFi.macAddress());
}

void loop()
{

    if (Serial.available() > 0)
    {
        Serial.println("Reading input...");
        int input = Serial.parseInt();
        responseData.led = input;

        esp_err_t result = esp_now_send(controllerMAC, (uint8_t *)&responseData, sizeof(responseData));
        if (result == ESP_OK)
        {
            Serial.println("Response sent successfully");
        }
        else
        {
            Serial.println("Error sending response");
        }
    }
}
