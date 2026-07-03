import amqp from "amqplib";

const RABBITMQ_URL = process.env.RABBIT_URL

let connection, channel;
let isConnecting = false;
let subscriptions = [];

async function connect() {
  if (connection) return;
  if (isConnecting) {
    while (isConnecting) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return;
  }
  
  isConnecting = true;
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    
    connection.on('error', (err) => {
      console.error("RabbitMQ Connection Error:", err.message);
    });
    
    connection.on('close', () => {
      console.warn("RabbitMQ Connection Closed, reconnecting...");
      channel = null;
      connection = null;
      setTimeout(connect, 2000);
    });
    
    channel = await connection.createChannel();
    
    channel.on('error', (err) => {
      console.error("RabbitMQ Channel Error:", err.message);
    });
    
    console.log("Connected to RabbitMQ");

    // Resubscribe to queues after reconnection
    const ch = channel;
    for (const sub of subscriptions) {
      await ch.assertQueue(sub.queueName);
      ch.consume(sub.queueName, (message) => {
        if (!message) return;
        sub.callback(message.content.toString());
        ch.ack(message);
      });
    }
  } catch (err) {
    console.error("Failed to connect to RabbitMQ:", err.message);
    setTimeout(connect, 2000);
  } finally {
    isConnecting = false;
  }
}

async function subscribeToQueue(queueName, callback) {
  subscriptions.push({ queueName, callback });
  if (!channel) {
    await connect();
  } else {
    const ch = channel;
    await ch.assertQueue(queueName);
    ch.consume(queueName, (message) => {
      if (!message) return;
      callback(message.content.toString());
      ch.ack(message);
    });
  }
}

async function publishToQueue(queueName, data) {
  if (!channel) await connect();
  await channel.assertQueue(queueName);
  channel.sendToQueue(queueName, Buffer.from(data));
}

export default {
  connect,
  subscribeToQueue,
  publishToQueue,
};
