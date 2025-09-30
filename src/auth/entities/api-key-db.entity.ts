import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiKeyRole } from './api-key.entity';

@Entity('api_keys')
@Index(['hashPrefix']) // Index for faster lookup
export class ApiKeyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 16 })
  @Index() // Index for fast lookup
  hashPrefix: string; // First 16 chars of hash for O(1) lookup

  @Column({ type: 'text' })
  hashedKey: string;

  @Column({ length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: ApiKeyRole,
    default: ApiKeyRole.USER,
  })
  role: ApiKeyRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastUsedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  @Column({ type: 'int', default: 100 })
  rateLimit: number;

  @Column({ type: 'bigint', default: 0 })
  requestCount: bigint;

  @Column({ type: 'text', nullable: true })
  createdBy: string | null; // For audit trail

  @Column({ type: 'text', nullable: true })
  lastUsedIp: string | null; // For audit trail
}