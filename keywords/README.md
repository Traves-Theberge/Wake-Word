# Wake Word Models - Powered by Picovoice

🎤 This folder contains your custom-trained wake word files created with **[Picovoice](https://picovoice.ai/)** - the industry leader in on-device voice AI technology.

## 🎯 Current Setup

You have the **"Hey Claude"** wake word ready to use! ✅

**File Naming Convention:**
Files must be named with the platform suffix:
- `hey-claude-en-windows.ppn` - Windows platform
- `hey-claude-en-linux.ppn` - Linux platform  
- `hey-claude-en-mac.ppn` - macOS platform

**Included Files:**
- `hey-claude-en-windows.ppn` - Your trained "Hey Claude" wake word model for Windows
- `LICENSE.txt` - Picovoice licensing terms

> ⚠️ **Important**: Wake word files (`.ppn`) are platform-specific! A file trained for Windows won't work on Linux or Mac. You must download the correct version for your platform from Picovoice Console.

## 🚀 How It Works

Your wake word detection is powered by **[Picovoice Porcupine](https://picovoice.ai/platform/porcupine/)**:

- **🔒 Private**: All processing happens on your device
- **⚡ Fast**: Real-time detection with minimal latency  
- **🎯 Accurate**: Advanced audio processing for reliable recognition
- **� Efficient**: Optimized for continuous background operation

## 🔧 Training Additional Keywords

Want to add more wake words? Here's how:

### Step 1: Access Picovoice Console
Visit [https://console.picovoice.ai/ppn](https://console.picovoice.ai/ppn)

### Step 2: Create New Keywords
1. Click **"Create New Keyword"**
2. Enter your desired phrase (e.g., "Hey Gemini", "Computer")
3. Choose your target platform: **Windows x64**

### Step 3: Train Your Model
1. **Record Samples**: Say your phrase clearly 10-20 times
2. **Vary Conditions**: Different volumes, speeds, backgrounds
3. **Quality Tips**:
   - Use the same microphone you'll use for detection
   - Record in a quiet environment
   - Speak naturally and consistently
   - Avoid background noise

### Step 4: Download & Install
1. Download the generated `.ppn` file
2. Rename it descriptively (e.g., `hey-gemini.ppn`)
3. Place it in this `keywords/` folder
4. Update your application configuration

## 📁 File Structure
```
keywords/
├── README.md           # This documentation
├── hey-claude.ppn      # ✅ Your "Hey Claude" model
└── LICENSE.txt         # Picovoice license terms
```

## 🎤 Usage & Testing

### **Current Command**
Say **"Hey Claude"** to trigger:
- 🖥️ **Cursor IDE** launch (if enabled)
- 🤖 **Claude CLI** in WSL terminal (if enabled)

### **Testing Tips**
1. **Consistency**: Say "Hey Claude" the same way you trained it
2. **Environment**: Use in similar conditions to training
3. **Microphone**: Same device and distance as training
4. **Clarity**: Speak clearly and at normal volume
5. **Patience**: Allow ~1 second between attempts

### **Troubleshooting Detection**
- ❌ **Not detecting?** Try speaking closer to microphone
- ❌ **False triggers?** Increase sensitivity in settings
- ❌ **Too sensitive?** Decrease sensitivity or retrain with more samples

## 💡 Pro Tips for Better Detection

### **Training Best Practices**
- **Multiple Sessions**: Train across different days/times
- **Voice Variations**: Include different emotions/energy levels
- **Background Variety**: Train with typical background sounds
- **Microphone Consistency**: Use your actual recording device

### **Optimal Performance**
- **Quiet Environment**: Minimize background noise during use
- **Consistent Distance**: Maintain similar distance from microphone
- **Natural Speech**: Don't over-enunciate or speak robotically
- **Regular Retraining**: Update model if your voice changes

## 🔮 Future Expansion Ideas

### **Multi-Assistant Setup**
Train additional wake words for different AI assistants:
- `hey-gemini.ppn` → Google Bard/Gemini
- `hey-copilot.ppn` → GitHub Copilot Chat  
- `computer.ppn` → General voice commands

### **Command-Specific Wake Words**
Create specific triggers for different actions:
- `open-cursor.ppn` → Launch IDE only
- `start-claude.ppn` → Launch Claude CLI only
- `voice-help.ppn` → Open application settings

## 🙏 Thanks to Picovoice

This wake word detection is made possible by **[Picovoice](https://picovoice.ai/)**:

> *"Picovoice's on-device voice AI platform enables private, accurate, and efficient wake word detection without compromising user privacy or requiring internet connectivity."*

### **Why Picovoice?**
- 🔒 **Privacy-First**: No audio data leaves your device
- ⚡ **Real-Time**: Instant detection with minimal CPU usage
- 🎯 **Accurate**: Industry-leading false positive/negative rates
- 🛠️ **Developer-Friendly**: Easy integration with excellent documentation

## 📞 Support & Resources

- **[Picovoice Console](https://console.picovoice.ai/)**: Train and manage wake words
- **[Porcupine Documentation](https://picovoice.ai/docs/porcupine/)**: Technical details
- **[Community Support](https://github.com/Picovoice/porcupine/discussions)**: Get help from experts
- **[Wake Word Best Practices](https://picovoice.ai/blog/)**: Tips and tutorials 