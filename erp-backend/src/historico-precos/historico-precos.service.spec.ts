import { Test, TestingModule } from '@nestjs/testing';
import { HistoricoPrecosService } from './historico-precos.service';

describe('HistoricoPrecosService', () => {
  let service: HistoricoPrecosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoricoPrecosService],
    }).compile();

    service = module.get<HistoricoPrecosService>(HistoricoPrecosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
