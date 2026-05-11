export const SYSTEM_PROMPT = `You are BloodBot, an AI emergency assistant for the BloodLink platform — an AI-powered blood and ambulance emergency response system.

Your role:
- Help patients find blood donors and blood banks urgently
- Guide donors on donation eligibility and process
- Assist with emergency blood requests
- Provide first-aid guidance while blood is en route
- Answer questions about blood types and compatibility
- Coordinate with nearby resources

Blood type compatibility (donor → recipient):
- O- : Universal donor → all types
- O+ : O+, A+, B+, AB+
- A- : A-, A+, AB-, AB+
- A+ : A+, AB+
- B- : B-, B+, AB-, AB+
- B+ : B+, AB+
- AB- : AB-, AB+
- AB+ : AB+ only (universal recipient)

Rules:
1. Always be calm, empathetic, and clear — this is an emergency context
2. For life-threatening emergencies, always recommend calling 108 (India emergency) or local emergency services
3. Keep responses concise and actionable
4. Never provide medical diagnoses
5. If unsure, direct users to nearby hospitals

Respond in the same language the user writes in.`

export const buildUserPrompt = (message, history = []) => {
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.slice(-6), // keep last 6 messages for context
    { role: 'user', content: message },
  ]
}

export const FALLBACK_RESPONSES = {
  emergency: `🚨 This sounds like an emergency! Please:
1. Call 108 (India Emergency) immediately
2. Tap "Emergency Request" in the app to alert nearby donors
3. Share your location with the ambulance
I'm alerting nearby donors with your blood type right now.`,

  blood_needed: `I can help you find blood quickly. Please:
1. Use "Create Blood Request" in the app — it alerts all nearby donors instantly
2. Contact nearby blood banks via the Blood Bank section
3. Call your nearest hospital blood bank directly
Which blood type do you need? I can provide compatibility information.`,

  donor_info: `To donate blood you should:
✅ Be 18-65 years old
✅ Weigh at least 50kg
✅ Have haemoglobin ≥ 12.5 g/dL
✅ Not have donated in the last 56 days
✅ Be free from infections

Toggle your availability in the Donor section to receive emergency alerts.`,

  find_donor: `I'm searching for nearby compatible donors. To get the best results:
1. Enable location in the app
2. Specify the blood group needed
3. Set urgency to "Critical" for fastest response

The app will broadcast to all available donors within 10km.`,

  default: `I'm here to help with blood and medical emergencies. You can ask me about:
- Finding blood donors nearby
- Blood type compatibility
- Donation eligibility
- Emergency procedures
- Nearby blood banks

What do you need help with?`,
}

export const detectIntent = (message) => {
  const lower = message.toLowerCase()
  if (lower.includes('emergency') || lower.includes('urgent') || lower.includes('dying') || lower.includes('critical'))
    return 'emergency'
  if (lower.includes('need blood') || lower.includes('blood needed') || lower.includes('require blood'))
    return 'blood_needed'
  if (lower.includes('donate') || lower.includes('donor') || lower.includes('eligible'))
    return 'donor_info'
  if (lower.includes('find') && lower.includes('donor'))
    return 'find_donor'
  return null
}
