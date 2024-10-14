// This file contains a function that sends emails to users in batches.
export const informStructureDeletion = (userEmail: string): Promise<void> => {
  // wait between 1 and 7 seconds
  const secondsToWait = Math.trunc(Math.random() * 7) + 1;

  return new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log(userEmail, 'informed!');
      resolve();
    }, secondsToWait * 1000);
  });
};

export const sendEmailsInBatches = async (emails: string[]): Promise<void> => {
  const batchSize = 3; // Limit to 3 emails at a time

  for (let i: number = 0; i < emails.length; i += batchSize) {
    // Slice out a batch of up to 3 emails
    const batch = emails.slice(i, i + batchSize);

    // Send all emails in the current batch concurrently
    const emailPromises = batch.map((email) => informStructureDeletion(email));

    // Wait for the current batch to complete
    await Promise.all(emailPromises);
  }
};
