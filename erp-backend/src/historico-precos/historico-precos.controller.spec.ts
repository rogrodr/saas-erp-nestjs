import { Test, TestingModule } from '@nestjs/testing';
import { HistoricoPrecosController } from './historico-precos.controller';

describe('HistoricoPrecosController', () => {
  let controller: HistoricoPrecosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoricoPrecosController],
    }).compile();

    controller = module.get<HistoricoPrecosController>(HistoricoPrecosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
