# Rubber Duck Sumo Robot

An advanced autonomous sumo robot designed for the IEEE Sumo-Bot Competition 2025, featuring sophisticated sensor fusion, fault-tolerant I²C communication, and precision PID control.

## 🏆 Competition Results

**1st Place** - IEEE Sumo-Bot Competition 2025 (Montreal Regional)

## 🎯 Project Overview

The Rubber Duck is a compact, high-performance sumo robot built around the ESP32 microcontroller. It combines multiple advanced technologies to create a robust, competitive autonomous system capable of detecting, tracking, and pushing opponents out of the ring while avoiding boundaries.

### Key Achievements
- **100Hz sensor refresh rate** for real-time opponent tracking
- **Zero ring-outs** during qualification rounds
- **1.7 m/s maximum push velocity** with dual VNH5019 motor drivers
- **Fault-tolerant I²C system** with automatic bus recovery

## 🔧 Technical Architecture

### Hardware Components
- **ESP32 DevKit V1** - Main microcontroller with dual-core processing
- **5x VL53L4CD ToF Sensors** - 180° opponent detection array
- **4x QTR Reflectance Sensors** - Ring boundary detection
- **Dual VNH5019 Motor Shield** - High-current motor control
- **Custom 3D-printed chassis** - Optimized for low center of gravity

### Software Architecture
```cpp
// Main control loop structure
void loop() {
    sensorArray.updateReadings();
    
    if (edgeDetected()) {
        executeAvoidanceManeuver();
    } else {
        Vector2 opponentVector = calculateOpponentVector();
        float pidOutput = pidController.calculate(opponentVector.angle);
        motorDriver.setSpeed(ATTACK_SPEED, pidOutput);
    }
}
```

## 🧠 Advanced Features

### 1. Fault-Tolerant I²C Communication
The robot implements a sophisticated I²C bus recovery system that can detect and resolve bus lock-up conditions:

```cpp
void I2CManager::resetBusThorough() {
    // Manual SCL pulsing to free stuck slave devices
    for (int i = 0; i < 9; i++) {
        digitalWrite(SCL_PIN, LOW);
        delayMicroseconds(5);
        digitalWrite(SCL_PIN, HIGH);
        delayMicroseconds(5);
    }
    Wire.begin(); // Reinitialize bus
}
```

### 2. PID-Based Opponent Tracking
The robot uses a tuned PID controller for smooth, responsive opponent tracking:

- **Proportional**: Immediate response to angle error
- **Integral**: Eliminates steady-state error
- **Derivative**: Prevents overshoot and oscillation

### 3. Sensor Fusion Algorithm
Combines data from 5 ToF sensors to create a robust opponent detection system:

```cpp
Vector2 calculateOpponentVector() {
    float totalX = 0, totalY = 0, totalWeight = 0;
    
    for (int i = 0; i < 5; i++) {
        if (distances[i] < MAX_DETECTION_RANGE) {
            float weight = 1.0 / (distances[i] + 1);
            float angle = sensorAngles[i];
            
            totalX += weight * cos(angle);
            totalY += weight * sin(angle);
            totalWeight += weight;
        }
    }
    
    return Vector2(totalX / totalWeight, totalY / totalWeight);
}
```

## 🚀 Performance Metrics

| Metric | Value | Description |
|--------|-------|-------------|
| Sensor Frequency | 100 Hz | ToF sensor update rate |
| Response Time | <10ms | Obstacle detection to motor response |
| Max Speed | 1.7 m/s | Forward attack velocity |
| Turn Rate | 180°/s | Maximum rotational velocity |
| Detection Range | 2000mm | Maximum opponent detection distance |
| Battery Life | 45 min | Continuous operation time |

## 🔍 Key Challenges & Solutions

### Challenge 1: I²C Bus Reliability
**Problem**: Multiple ToF sensors on the same I²C bus occasionally caused communication failures.

**Solution**: Implemented dynamic address assignment using XSHUT pins and a comprehensive bus recovery system that can detect and resolve lock-up conditions automatically.

### Challenge 2: Sensor Noise & False Positives
**Problem**: ToF sensors occasionally returned erratic readings, causing unpredictable behavior.

**Solution**: Added multi-point validation and temporal filtering to ensure consistent readings before acting on sensor data.

### Challenge 3: Motor Control Precision
**Problem**: Basic motor control caused jerky movements and poor opponent tracking.

**Solution**: Implemented a PID control system with anti-windup protection, providing smooth and accurate opponent following.

## 📊 Competition Performance

### Qualification Rounds
- **Matches Won**: 8/8
- **Ring-outs**: 0
- **Average Match Duration**: 12 seconds
- **Fastest Victory**: 3.2 seconds

### Technical Achievements
- Successfully detected opponents at maximum sensor range (2m)
- Maintained stable tracking through rapid opponent movements
- Zero technical failures during competition
- Consistent sub-10ms response times

## 🛠️ Development Process

### Phase 1: Hardware Design (Week 1-2)
- Component selection and compatibility testing
- Chassis design and 3D printing iterations
- Sensor mounting and calibration

### Phase 2: Software Development (Week 3-6)
- Basic motor control implementation
- Sensor integration and testing
- PID controller tuning and optimization

### Phase 3: Competition Preparation (Week 7-8)
- Stress testing and reliability improvements
- Strategy refinement and edge case handling
- Final calibration and competition setup

## 🔮 Future Improvements

### High Priority
- **Machine Learning Integration**: Implement opponent behavior prediction using collected match data
- **Advanced Path Planning**: Add A* pathfinding for complex opponent evasion scenarios

### Medium Priority
- **Wireless Telemetry**: Real-time performance monitoring during matches
- **Adaptive PID Tuning**: Self-adjusting control parameters based on opponent behavior

### Low Priority
- **Multi-Robot Coordination**: Support for team-based competitions
- **Enhanced Diagnostics**: Comprehensive self-test and health monitoring systems

## 📚 Technical Documentation

### Code Structure
```
src/
├── main.cpp              # Main control loop
├── I2CManager.cpp        # Bus management and recovery
├── DistanceSensorArray.cpp # ToF sensor handling
├── ReflectanceSensorArray.cpp # Edge detection
├── MotorDriver.cpp       # Motor control abstraction
├── PIDController.cpp     # Control algorithm
└── TestMode.cpp          # Diagnostic systems
```

### Key Libraries
- **Wire.h**: I²C communication
- **VL53L4CD.h**: ToF sensor interface
- **QTRSensors.h**: Reflectance sensor library
- **DualVNH5019MotorShield.h**: Motor driver control

## 🏅 Awards & Recognition

- **1st Place** - IEEE Sumo-Bot Competition 2025
- **Technical Excellence Award** - Most Innovative Sensor Integration
- **Best Documentation** - Comprehensive technical documentation

## 🤝 Team & Contributions

**Team Size**: 2 developers
**Development Time**: 8 weeks
**My Role**: Lead Developer, Hardware Integration, Algorithm Design

### Key Contributions
- Designed and implemented the fault-tolerant I²C communication system
- Developed the sensor fusion algorithm for opponent tracking
- Tuned and optimized the PID control system
- Created comprehensive testing and diagnostic frameworks

## 📞 Contact & Links

- **Repository**: [GitHub](https://github.com/cabbagecultist/Sumo)
- **Competition**: IEEE Sumo-Bot Competition 2025
- **Team**: Express-O Robotics

---

*This project demonstrates advanced embedded systems programming, real-time control algorithms, and competitive robotics engineering. The combination of hardware reliability and software sophistication resulted in a championship-winning autonomous system.*