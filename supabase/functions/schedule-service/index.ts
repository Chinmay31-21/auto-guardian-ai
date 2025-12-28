import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SchedulingRequest {
  alertId: string;
  vehicleId: string;
  component: string;
  severity: string;
  predictedFailureDate: string;
  estimatedCost: number;
  recommendedAction: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  location: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const requestData: SchedulingRequest = await req.json();

    const systemPrompt = `You are an intelligent fleet maintenance scheduling agent. Your role is to analyze maintenance alerts and provide optimal scheduling recommendations.

Consider the following factors when scheduling:
1. Severity of the issue (critical issues need immediate attention)
2. Predicted failure date (schedule before this date)
3. Customer location (recommend nearest service center)
4. Estimated repair time based on component
5. Customer availability preferences
6. Service center capacity

Provide a structured response with:
- Recommended scheduling date and time
- Best service center based on location
- Estimated repair duration
- Priority level
- Any special instructions for the technician
- Customer communication message`;

    const userPrompt = `Analyze this maintenance alert and provide scheduling recommendations:

Alert Details:
- Component: ${requestData.component}
- Severity: ${requestData.severity}
- Predicted Failure Date: ${requestData.predictedFailureDate}
- Recommended Action: ${requestData.recommendedAction}
- Estimated Cost: ₹${requestData.estimatedCost}

Vehicle Details:
- Make/Model: ${requestData.vehicleMake} ${requestData.vehicleModel} (${requestData.vehicleYear})
- Location: ${requestData.location}

Customer Details:
- Name: ${requestData.customerName}
- Phone: ${requestData.customerPhone}
- Email: ${requestData.customerEmail}

Provide optimal scheduling recommendations in JSON format.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_schedule",
              description: "Create an optimal service schedule for the maintenance alert",
              parameters: {
                type: "object",
                properties: {
                  scheduledDate: {
                    type: "string",
                    description: "Recommended date in YYYY-MM-DD format"
                  },
                  scheduledTime: {
                    type: "string",
                    description: "Recommended time slot (e.g., '10:00 AM')"
                  },
                  serviceCenterName: {
                    type: "string",
                    description: "Recommended service center name"
                  },
                  serviceCenterLocation: {
                    type: "string",
                    description: "Service center address"
                  },
                  estimatedDuration: {
                    type: "number",
                    description: "Estimated repair duration in minutes"
                  },
                  priority: {
                    type: "string",
                    enum: ["low", "normal", "high", "urgent"],
                    description: "Priority level for the appointment"
                  },
                  technicianNotes: {
                    type: "string",
                    description: "Special instructions for the technician"
                  },
                  customerMessage: {
                    type: "string",
                    description: "Message to send to the customer about the appointment"
                  },
                  reasoning: {
                    type: "string",
                    description: "Brief explanation of why this schedule was recommended"
                  }
                },
                required: ["scheduledDate", "scheduledTime", "serviceCenterName", "estimatedDuration", "priority", "customerMessage", "reasoning"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "create_schedule" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get AI scheduling recommendations");
    }

    const aiResponse = await response.json();
    
    // Extract the function call arguments
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "create_schedule") {
      throw new Error("Invalid AI response format");
    }

    const schedule = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({
      success: true,
      schedule: {
        ...schedule,
        alertId: requestData.alertId,
        vehicleId: requestData.vehicleId,
        component: requestData.component,
        severity: requestData.severity,
        estimatedCost: requestData.estimatedCost
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Scheduling error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
