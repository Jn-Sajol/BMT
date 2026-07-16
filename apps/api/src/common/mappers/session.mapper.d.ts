import { UserSession } from '@prisma/client';
import { SessionResponseDto } from '../dto/session.dto';
export declare class SessionMapper {
    static toResponse(session: UserSession): SessionResponseDto;
    static toResponseList(sessions: UserSession[]): SessionResponseDto[];
}
