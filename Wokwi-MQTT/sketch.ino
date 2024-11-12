#include <DHT.h>
#include <WiFi.h>
#include <PubSubClient.h>

#define DHTPIN 15      // PIN DHT Sensor
#define DHTTYPE DHT22  // Tipe sensor (sesuaikan jika menggunakan tipe lain)

DHT dht(DHTPIN, DHTTYPE);

const int ledGreen = 5;   // Lampu hijau PIN 5
const int ledYellow = 17; // Lampu kuning PIN 17
const int ledRed = 16;    // Lampu merah PIN 16
const int relayPump = 4;  // Relay pompa PIN 4
const int buzzer = 14;    // Buzzer PIN 14

const char* ssid = "Wokwi-GUEST";  // SSID WiFi
const char* password = "";         // Password WiFi (kosong untuk Wokwi)
const char* mqtt_server = "broker.hivemq.com"; // Server MQTT publik

WiFiClient espClient;
PubSubClient client(espClient);

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
}

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

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  if (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32Client")) {
      Serial.println("connected");
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
    client.loop();
  }

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

    // Kondisi pompa hanya menyala jika suhu panas dan kelembapan rendah
    if (hum < 40) {
      digitalWrite(relayPump, HIGH);
      Serial.println("Pompa menyala: Suhu tinggi dan kelembapan rendah.");
    } else {
      digitalWrite(relayPump, LOW);
    }

  } else if (temp >= 30 && temp <= 35) {
    digitalWrite(ledYellow, HIGH);
    digitalWrite(buzzer, LOW);
    digitalWrite(ledRed, LOW);
    digitalWrite(ledGreen, LOW);
    digitalWrite(relayPump, LOW); // Pompa mati jika suhu tidak panas
  } else {
    digitalWrite(ledGreen, HIGH);
    digitalWrite(buzzer, LOW);
    digitalWrite(ledYellow, LOW);
    digitalWrite(ledRed, LOW);
    digitalWrite(relayPump, LOW); // Pompa mati jika suhu tidak panas
  }

  // Mengirim data melalui MQTT
  char temperatureString[8];
  dtostrf(temp, 1, 2, temperatureString);
  char humidityString[8];
  dtostrf(hum, 1, 2, humidityString);
  
  client.publish("iot/hydroponic/temperature", temperatureString);
  client.publish("iot/hydroponic/humidity", humidityString);

  // Delay satu jam
  delay(3600000); // 1 jam dalam milidetik (3,600,000 ms)
}
