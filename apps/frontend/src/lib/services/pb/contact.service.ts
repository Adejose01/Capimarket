import pb from "@/lib/pocketbase";
import type { ContactTicket } from "@/lib/types/pocketbase";

export const contactService = {
  async create(data: {
    user: string;
    name: string;
    reason: string;
    message: string;
  }) {
    return await pb.collection("contact").create({
      ...data,
      active: true, // Se crea activo por defecto
    });
  },

  async getByUser(userId: string): Promise<ContactTicket[]> {
    return await pb.collection("contact").getFullList<ContactTicket>({
      filter: `user = "${userId}"`,
      sort: "-created",
    });
  },
};
