export async function informStructureDeletion(
  userEmail: string,
): Promise<void> {
  // Wait between 1 and 7 seconds
  const secondsToWait = Math.trunc(Math.random() * 7) + 1;

  return new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log(`Email sent to ${userEmail} after ${secondsToWait} seconds!`);
      resolve();
    }, secondsToWait * 1000);
  });
}
