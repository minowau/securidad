import tf from '@tensorflow/tfjs-node';
import { BehavioralData } from '../models/BehavioralData.js';

class BehavioralMonitoring {
  constructor() {
    this.model = null;
    this.initializeModel();
  }

  async initializeModel() {
    // Simple anomaly detection model
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [10], units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });
  }

  async processUserBehavior(behavioralData) {
    const tensor = tf.tensor2d([this.preprocessBehavioralData(behavioralData)]);
    const prediction = await this.model.predict(tensor).data();
    return {
      riskScore: prediction[0],
      confidence: this.calculateConfidence(behavioralData)
    };
  }

  preprocessBehavioralData(data) {
    // Convert behavioral data into normalized feature vector
    const features = [
      ...this.normalizeTypingFeatures(data.typingPatterns),
      ...this.normalizeNavigationFeatures(data.navigationPatterns),
      ...this.normalizeTouchFeatures(data.touchPatterns)
    ];
    return features;
  }

  normalizeTypingFeatures(patterns) {
    // Implement typing pattern normalization
    return patterns.map(p => p / 1000); // Simple normalization example
  }

  normalizeNavigationFeatures(patterns) {
    // Implement navigation pattern normalization
    return patterns.map(p => p / 100);
  }

  normalizeTouchFeatures(patterns) {
    // Implement touch pattern normalization
    return patterns.map(p => p / 500);
  }

  calculateConfidence(data) {
    // Implement confidence calculation based on data quality and quantity
    const dataPoints = data.typingPatterns.length + 
                      data.navigationPatterns.length + 
                      data.touchPatterns.length;
    return Math.min(dataPoints / 100, 1);
  }
}

const monitor = new BehavioralMonitoring();

export const setupBehavioralMonitoring = (io) => {
  io.on('connection', (socket) => {
    socket.on('behavioral-data', async (data) => {
      try {
        const analysis = await monitor.processUserBehavior(data);
        
        // Store behavioral data
        await BehavioralData.create({
          userId: socket.user.id,
          ...data,
          analysis
        });

        // Emit risk assessment
        socket.emit('risk-assessment', analysis);

        // High risk alert
        if (analysis.riskScore > 0.7) {
          io.to(`user-${socket.user.id}`).emit('security-alert', {
            type: 'high-risk',
            message: 'Unusual behavior detected'
          });
        }
      } catch (error) {
        console.error('Behavioral analysis error:', error);
      }
    });
  });
};