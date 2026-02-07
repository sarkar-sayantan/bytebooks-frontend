export const serverUserService = {
  async getUserByEmail(email: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/email/${email}`, {
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!res.ok) return null;
    return res.json();
  },
};
