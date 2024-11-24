import { Test, TestingModule } from '@nestjs/testing';
import { ForwardingController } from './forwarding.controller';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { EntitiesService } from 'src/entities/entities.service';

// Mocka Axios corretamente como uma versão tipada
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ForwardingController', () => {
    let forwardingController: ForwardingController;
    let entitiesService: EntitiesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ForwardingController],
            providers: [
                {
                    provide: EntitiesService,
                    useValue: {
                        findAll: jest.fn().mockReturnValue(['entity1', 'entity2']), // Mocka o método findAll
                    },
                },
            ],
        }).compile();

        forwardingController = module.get<ForwardingController>(
            ForwardingController,
        );
        entitiesService = module.get<EntitiesService>(EntitiesService);
    });

    it('should forward request and return findAll response on success', async () => {
        // Mocka o comportamento do Axios para simular sucesso
        const axiosMockResponse: AxiosResponse = {
            data: { success: true },
            status: 200,
            statusText: 'OK',
            headers: { 'content-type': 'application/json' },
            config: {
                headers: {}, // Headers necessários para o mock
                method: 'GET',
                url: '/mock-url',
            } as any, // Cast para InternalAxiosRequestConfig
        };
        mockedAxios.request.mockResolvedValue(axiosMockResponse);

        const mockRequest: any = {
            method: 'POST',
            body: {},
            headers: {},
        };
        const mockResponse: any = {
            json: jest.fn().mockImplementation((result) => result),
        };

        const result = await forwardingController.forward(mockRequest, mockResponse);

        expect(result).toEqual(['entity1', 'entity2']); // Resposta de findAll
        expect(mockResponse.json).toHaveBeenCalledWith(['entity1', 'entity2']);
    });

    it('should return error response on Axios failure', async () => {
        // Mocka um erro no Axios com todas as propriedades necessárias
        const axiosError: Partial<AxiosError> = {
            response: {
                data: 'Internal Server Error',
                status: 500,
                statusText: 'Internal Server Error',
                headers: { 'content-type': 'application/json' },
                config: {
                    headers: {},
                    method: 'POST',
                    url: '/mock-url',
                } as any, // Cast para InternalAxiosRequestConfig
            } as AxiosResponse,
        };
        mockedAxios.request.mockRejectedValue(axiosError);

        const mockRequest: any = {
            method: 'POST',
            body: {},
            headers: {},
        };
        const mockResponse: any = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockImplementation((result) => result),
        };

        const result = await forwardingController.forward(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500); // Verifica se retornou status 500
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Erro ao processar a requisição externa',
            details: 'Internal Server Error',
        });
    });
});
