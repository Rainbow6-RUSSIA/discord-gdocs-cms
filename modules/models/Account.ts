import { createHash } from "crypto"
import { Entity, Column, Index, BaseEntity, PrimaryGeneratedColumn, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity()
@Unique(["compoundId"])
export class Account extends BaseEntity {
  constructor (fields: Pick<Account, "providerId" | "providerAccountId"> & Partial<Account>) {
    super();
    Object.assign(this, fields);
    this.compoundId = createHash("sha256").update(`${this.providerId}:${this.providerAccountId}`).digest("hex")
  }

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  compoundId: string;
  
  @Index()
  @Column("uuid")
  userId!: string;

  @Column()
  providerType!: string;
  
  @Index()
  @Column()
  providerId!: string;
  
  @Index()
  @Column()
  providerAccountId!: string;
  
  @Column({ nullable: true })
  refreshToken?: string;
  
  @Column({ nullable: true })
  accessToken?: string;
  
  @Column({ nullable: true })
  accessTokenExpires?: Date;

  @CreateDateColumn()
  createDate!: Date

  @UpdateDateColumn()
  updateDate!: Date
}