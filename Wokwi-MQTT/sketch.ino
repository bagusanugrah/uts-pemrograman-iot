#include <DHT.h>
#include <WiFi.h>
#include <PubSubClient.h>

#define DHTPIN 15       // PIN DHT Sensor
#define DHTTYPE DHT22   // Tipe sensor

DHT dht(DHTPIN, DHTTYPE);

const int ledGreen = 5;
const int ledYellow = 17;
const int ledRed = 16;
const int relayPump = 4;
const int buzzer = 14;

const char* ssid = "Wokwi-GUEST";
const char* password = "";
const char* mqtt_server = "broker.hivemq.com";

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastSensorPublish = 0;
const unsigned long sensorInterval = 10000; // mengirim data setiap 10 detik

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void controlPump(String command) {
  if (command == "ON") {
    digitalWrite(relayPump, HIGH);
    Serial.println("Pompa menyala dari perintah MQTT.");
  } else if (command == "OFF") {
    digitalWrite(relayPump, LOW);
    Serial.println("Pompa dimatikan dari perintah MQTT.");
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.print("Pesan diterima pada topik ");
  Serial.print(topic);
  Serial.print(": ");
  Serial.println(message);

  if (String(topic) == "iot/hydroponic-152022029/pompa") {
    controlPump(message);
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();

  pinMode(ledGreen, OUTPUT);
  pinMode(ledYellow, OUTPUT);
  pinMode(ledRed, OUTPUT);
  pinMode(relayPump, OUTPUT);
  pinMode(buzzer, OUTPUT);

  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32Client")) {
      Serial.println("connected");
      client.subscribe("iot/hydroponic-152022029/pompa");
      Serial.println("Subscribed to topic iot/hydroponic-152022029/pompa");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  } else {
    client.loop(); // Ensure this is constantly running
  }

  unsigned long currentMillis = millis();
  if (currentMillis - lastSensorPublish >= sensorInterval) {
    float temp = dht.readTemperature();
    float hum = dht.readHumidity();

    if (isnan(temp) || isnan(hum)) {
      Serial.println("Failed to read from DHT sensor!");
      return;
    }

    // Kondisi suhu
    if (temp > 35) {
      digitalWrite(ledRed, HIGH);
      digitalWrite(buzzer, HIGH);
      digitalWrite(ledYellow, LOW);
      digitalWrite(ledGreen, LOW);
      Serial.println("Buzzer menyala: Suhu terlalu panas!");
    } else if (temp >= 30 && temp <= 35) {
      digitalWrite(ledYellow, HIGH);
      digitalWrite(buzzer, LOW);
      digitalWrite(ledRed, LOW);
      digitalWrite(ledGreen, LOW);
    } else {
      digitalWrite(ledGreen, HIGH);
      digitalWrite(buzzer, LOW);
      digitalWrite(ledYellow, LOW);
      digitalWrite(ledRed, LOW);
    }

    char temperatureString[8];
    dtostrf(temp, 1, 2, temperatureString);
    client.publish("iot/hydroponic-152022029/temperature", temperatureString);

    char humidityString[8];
    dtostrf(hum, 1, 2, humidityString);
    client.publish("iot/hydroponic-152022029/humidity", humidityString);

    lastSensorPublish = currentMillis;
    Serial.println("Data sensor dikirim ke MQTT.");
  }

  delay(2000);
}