export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return new Response("请使用 POST 请求", { status: 405 });
  }

  try {
    const { question } = await context.request.json();

    if (!question || typeof question !== "string" || !question.trim()) {
      return Response.json({ error: "问题不能为空。" }, { status: 400 });
    }

    // 调用 Workers AI 模型
    const answer = await context.env.AI.run(
      "@cf/zai-org/glm-4.7-flash",
      {
        messages: [
          {
            role: "system",
            content: "你是一位名叫林骏的传统文化研究者，研习空间文化近三十年，师从港台资深学者，研习周易与东方生活哲学，专注家居与办公空间的布局优化。请用中文回答，语气平和、深邃，像一位温和的长者。注意：你不做命理预测，不谈改运，不传播迷信。遇到运势、风水、算命、改运、辟邪等提问，要从空间环境、采光、动线、生活状态等理性角度回应，说明这只是一个观察和分享的传统视角，不夸大效果、不承诺结果。回答要克制、务实，先理解用户的具体处境，再给温和的建议。"
          },
          { role: "user", content: question }
        ]
      }
    );

    return Response.json({ answer: answer.response });
  } catch (error) {
    return Response.json({ error: "AI 调用失败，请稍后再试。" }, { status: 500 });
  }
}
