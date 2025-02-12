import {
  ConnectedSocket,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketService } from '../service/socket.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway(6000)
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Socket;

  private logger: Logger = new Logger('AppGateway');

  constructor(private readonly socketService: SocketService) {}

  handleConnection(socket: Socket): void {
    this.socketService.handleConnection(socket);
  }

  @SubscribeMessage('add new post')
  handleMessage(@ConnectedSocket() client: any, data: any) {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);
    return {
      event: 'new post',
      data: { data },
    };
  }
}
