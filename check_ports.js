const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

async function checkPorts() {
  const ports = await SerialPort.list();

  if (ports.length === 0) {
    throw new Error("No available serial ports found.");
  }

  const connectionCheck = ports.map(
    (portInfo) =>
      new Promise((resolve, reject) => {
        const portPath = portInfo.path;
        console.log(`Checking port: ${portPath}`);

        const port = new SerialPort({
          path: portPath,
          baudRate: 115200,
          autoOpen: false,
        });

        let isConnected = false;
        const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

        port.open((err) => {
          if (err) {
            console.log(`Error opening port ${portPath}:`, err.message);
            reject(new Error(`Failed to open port ${portPath}`));
            return;
          }

          console.log(`Port ${portPath} opened, sending connection request...`);
          // Send "connect" message to check the board's response
          port.write("connect\n", (err) => {
            if (err) {
              console.log(`Error writing to port ${portPath}:`, err.message);
              port.close();
              reject(new Error(`Failed to write to port ${portPath}`));
            }
          });
        });

        parser.on("data", (data) => {
          if (data.trim() === "connected") {
            console.log(`Device connected on port: ${portPath}`);
            isConnected = true;
          }
        });

        // Timeout to wait for the "connected" message
        setTimeout(() => {
          if (isConnected) {
            resolve(port); // Successfully connected
          } else {
            port.close(() => {
              console.log(
                `No valid response on port: ${portPath}, closing port.`
              );
            });
            reject(new Error(`No connection on port ${portPath}`));
          }
        }, 3000); // Wait 3 seconds for the connection
      })
  );

  return Promise.any(connectionCheck);
}

function startReadingData(port) {
  const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

  port.on("open", () => {
    console.log("Port opened.");
    console.log("Starting to read data...");
  });

  // Event listener for when data is received from ESP32
  parser.on("data", (data) => {
    console.log("Data from ESP32:", data);
  });

  port.on("error", (err) => {
    console.error("Error: ", err.message);
  });
}

module.exports = checkPorts;
