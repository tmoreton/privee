export default async (token: string, title: string, body: string) => {
  try {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: token,
        title: title,
        body: body,
      }),
    })
  } catch (e) {
    console.error(e)
  }
}