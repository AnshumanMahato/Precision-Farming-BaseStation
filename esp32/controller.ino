#include <WiFi.h>
#include <esp_now.h>
#include <DHT.h>

#define DHTPIN 14
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

#define SOIL_PIN 35

// Structure to hold sensor data
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

struct_message sensorData;
struct_response responseData;

uint8_t receiverMAC[] = {0x7C, 0x9E, 0xBD, 0x61, 0xAB, 0x40};

void onDataSent(const uint8_t *mac_addr, esp_now_send_status_t status)
{
    Serial.print("Delivery status: ");
    Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Success" : "Fail");
}

void onDataReceive(const esp_now_recv_info *info, const uint8_t *data, int len)
{
    // Copy the received data into the responseData structure
    memcpy(&responseData, data, sizeof(responseData));

    // Print the received data (response) to the serial monitor
    Serial.println("Response from receiver:");
    if (responseData.led == 1)
    {
        digitalWrite(LED_BUILTIN, HIGH);
    }
    else if (responseData.led == 2)
    {
        digitalWrite(LED_BUILTIN, LOW);
    }
}

void setup()
{
    Serial.begin(115200);

    dht.begin();

    pinMode(LED_BUILTIN, OUTPUT);

    WiFi.mode(WIFI_STA);
    if (esp_now_init() != ESP_OK)
    {
        Serial.println("Error initializing ESP-NOW");
        return;
    }

    esp_now_peer_info_t peerInfo;
    memcpy(peerInfo.peer_addr, receiverMAC, 6);
    peerInfo.channel = 0;
    peerInfo.encrypt = false;
    if (esp_now_add_peer(&peerInfo) != ESP_OK)
    {
        Serial.println("Failed to add peer");
        return;
    }

    esp_now_register_send_cb(onDataSent);
    esp_now_register_recv_cb(onDataReceive);
}

void loop()
{
    sensorData.temperature = dht.readTemperature();
    sensorData.humidity = dht.readHumidity();
    sensorData.soilMoisture = analogRead(SOIL_PIN);

    esp_err_t result = esp_now_send(receiverMAC, (uint8_t *)&sensorData, sizeof(sensorData));

    if (result == ESP_OK)
    {
        Serial.println("Data sent successfully");
    }
    else
    {
        Serial.println("Error sending data");
        Serial.println(result);
    }

    delay(2000);
}
