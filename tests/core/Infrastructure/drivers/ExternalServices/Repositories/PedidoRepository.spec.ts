import { describe, it, expect, beforeEach, vi } from "vitest";
import { prisma } from "@/Infrastructure/lib/prisma";
import PedidoRepository from "@/Infrastructure/drivers/Repositories/PedidoRepository";

// Mocking Prisma client
vi.mock("@/Infrastructure/lib/prisma", () => ({
  prisma: {
    pedido: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe("PedidoRepository", () => {
  let repository: PedidoRepository;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    repository = new PedidoRepository();
  });

  it("deve criar um pedido corretamente", async () => {
    const pedidoData = {
      id: 1,
      id_cliente: 1,
      valor_final: 100,
      tipo_pagamento: "pix",
      status: "recebido",
      status_pagamento: "aguardando",
      created_at: new Date(),
      updated_at: new Date(),
    };

    vi.mocked(prisma.pedido.create).mockResolvedValue(pedidoData);

    const result = await repository.createAsync(pedidoData);
    expect(prisma.pedido.create).toHaveBeenCalledWith({ data: pedidoData });
    expect(result).toEqual(pedidoData);
  });

  it("deve atualizar um pedido corretamente", async () => {
    const pedidoData = {
      id: 1,
      id_cliente: 1,
      valor_final: 100,
      tipo_pagamento: "pix",
      status: "recebido",
      status_pagamento: "aguardando",
      created_at: new Date(),
      updated_at: new Date(),
    };
    vi.mocked(prisma.pedido.update).mockResolvedValue(pedidoData);

    const result = await repository.updateAsync(pedidoData);
    expect(prisma.pedido.update).toHaveBeenCalledWith({
      where: { id: pedidoData.id },
      data: {
        id_cliente: pedidoData.id_cliente,
        valor_final: pedidoData.valor_final,
        tipo_pagamento: pedidoData.tipo_pagamento,
        status: pedidoData.status,
      },
    });
    expect(result).toEqual(pedidoData);
  });

  it("deve atualizar o status de um pedido corretamente", async () => {
    const novoStatus = "pronto";
    const pedidoData = {
      id: 1,
      id_cliente: 1,
      valor_final: 100,
      tipo_pagamento: "pix",
      status: novoStatus,
      status_pagamento: "aguardando",
      created_at: new Date(),
      updated_at: new Date(),
    };

    vi.mocked(prisma.pedido.update).mockResolvedValue(pedidoData);

    const result = await repository.updateStatusAsync(1, novoStatus);
    expect(prisma.pedido.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: novoStatus },
    });
    expect(result).toEqual(pedidoData);
  });

  it("deve encontrar um pedido por ID corretamente", async () => {
    const pedidoData = {
      id: 1,
      id_cliente: 1,
      valor_final: 100,
      tipo_pagamento: "pix",
      status: "recebido",
      status_pagamento: "aguardando",
      created_at: new Date(),
      updated_at: new Date(),
    };
    vi.mocked(prisma.pedido.findUnique).mockResolvedValue(pedidoData);

    const result = await repository.findByIdAsync(1);
    expect(prisma.pedido.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(pedidoData);
  });

  it("deve encontrar todos os pedidos não finalizados corretamente", async () => {
    const pedidoData1 = {
      id: 1,
      id_cliente: 1,
      valor_final: 100,
      tipo_pagamento: "pix",
      status: "recebido",
      status_pagamento: "aguardando",
      created_at: new Date(),
      updated_at: new Date(),
    };
    const pedidoData2 = {
      id: 1,
      id_cliente: 1,
      valor_final: 100,
      tipo_pagamento: "pix",
      status: "em preparacao",
      status_pagamento: "aguardando",
      created_at: new Date(),
      updated_at: new Date(),
    };
    const pedidosData = [pedidoData1, pedidoData2];

    vi.mocked(prisma.pedido.findMany).mockResolvedValue(pedidosData);

    const result = await repository.findAllNaoFinalizadosAsync();
    expect(prisma.pedido.findMany).toHaveBeenCalledWith({
      where: { NOT: { status: { equals: "finalizado" } } },
      orderBy: [{ created_at: "asc" }],
    });
    expect(result).toEqual(pedidosData);
  });
});
