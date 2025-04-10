import * as faceapi from 'face-api.js';
import toast from 'react-hot-toast';

export interface EmotionData {
  timestamp: number;
  emotions: {
    neutral: number;
    happy: number;
    sad: number;
    angry: number;
    fearful: number;
    disgusted: number;
    surprised: number;
  };
}

class FaceDetectionService {
  private modelsLoaded: boolean = false;
  private analysisInterval: NodeJS.Timeout | null = null;

  async loadModels() {
    if (this.modelsLoaded) return;

    try {
      toast.loading('Loading face detection models...', { id: 'models-loading' });
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
      ]);
      
      this.modelsLoaded = true;
      toast.success('Face detection models loaded!', { id: 'models-loading' });
    } catch (error) {
      toast.error('Failed to load face detection models', { id: 'models-loading' });
      console.error('Error loading face detection models:', error);
      throw error;
    }
  }

  async detectFace(video: HTMLVideoElement): Promise<boolean> {
    if (!this.modelsLoaded) {
      await this.loadModels();
    }

    try {
      const detection = await faceapi.detectSingleFace(
        video,
        new faceapi.TinyFaceDetectorOptions()
      );
      
      return !!detection;
    } catch (error) {
      console.error('Error detecting face:', error);
      return false;
    }
  }

  async analyzeEmotions(video: HTMLVideoElement): Promise<faceapi.FaceExpressions | null> {
    if (!this.modelsLoaded) {
      await this.loadModels();
    }

    try {
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      return detection?.expressions || null;
    } catch (error) {
      console.error('Error analyzing emotions:', error);
      return null;
    }
  }

  startEmotionTracking(
    video: HTMLVideoElement,
    onEmotionDetected: (data: EmotionData) => void,
    interval: number = 2000
  ) {
    if (this.analysisInterval) {
      this.stopEmotionTracking();
    }

    this.analysisInterval = setInterval(async () => {
      const emotions = await this.analyzeEmotions(video);
      if (emotions) {
        const emotionData: EmotionData = {
          timestamp: video.currentTime,
          emotions: emotions
        };
        onEmotionDetected(emotionData);
      }
    }, interval);
  }

  stopEmotionTracking() {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }
  }
}

export const faceDetectionService = new FaceDetectionService();
