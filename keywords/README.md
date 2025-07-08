# Custom Keywords for Claude

This folder is where you place your custom trained wake word files.

## 🎯 Required Keyword

To use the custom Claude detector, you need:

1. **hey-claude.ppn** - For "hey claude" wake word ✅ (You have this!)

## 🔧 How to Train Additional Keywords

### Step 1: Visit Picovoice Console
Go to [https://console.picovoice.ai/ppn](https://console.picovoice.ai/ppn)

### Step 2: Create New Keywords
1. Click "Create New Keyword"
2. Enter the phrase exactly as you want to say it:
   - **"hey claude"** ✅ (already done)
   - **"hey gemini"** (optional for future)

### Step 3: Train the Keywords
1. Record yourself saying the phrase multiple times
2. Follow Picovoice's training guidelines for best results
3. Use a quiet environment
4. Speak clearly and consistently

### Step 4: Download and Place Files
1. Download the generated `.ppn` files
2. Rename them to:
   - `hey-claude.ppn` ✅ (you have this)
   - `hey-gemini.ppn` (optional)
3. Place files in this `keywords/` folder

## 📁 Current File Structure
```
keywords/
├── README.md           # This file
├── hey-claude.ppn      # ✅ Your trained "hey claude" keyword
└── LICENSE.txt         # Picovoice license
```

## 🚀 Usage

### Claude-Only (Current Setup)
```bash
# Run with your custom "hey claude" keyword
npm run claude
```

### Alternative Options
```bash
# Built-in keywords (computer=Claude, jarvis=Gemini)
npm run ai:assistant

# Basic examples
npm run example:basic
```

## 💡 Tips for Better Detection

1. **Consistency**: Say "hey claude" the same way each time
2. **Environment**: Use in a quiet room
3. **Microphone**: Use the same microphone you trained with
4. **Pronunciation**: Be clear and natural
5. **Distance**: Stay at similar distance from microphone

## 🎤 Testing Your Claude Keyword

1. Make sure your `.env` file has your Picovoice access key
2. Run: `npm run claude`
3. Say "hey claude" - should open WSL terminal for Claude
4. If detection is poor, consider retraining with more samples

## 🔮 Future Expansion

When you want to add Gemini later:
1. Train "hey gemini" keyword at Picovoice Console
2. Save as `hey-gemini.ppn` in this folder
3. Use `npm run ai:custom` for both keywords

## 📞 Support

If you have issues with keyword detection:
- Check [Picovoice Documentation](https://picovoice.ai/docs/)
- Ensure your microphone is working properly
- Verify the .ppn file is in the correct location
- Try retraining with more voice samples 