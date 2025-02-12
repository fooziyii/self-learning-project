import { Module } from '@nestjs/common';
import { SocketGateway } from './gateway/socket.gateway';
import { SocketService } from './service/socket.service';

@Module({
  providers: [SocketGateway, SocketService],
  exports: [SocketGateway, SocketService],
})
export class SocketModule {}
