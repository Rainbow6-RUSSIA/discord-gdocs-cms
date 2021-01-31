import { createHash } from "crypto"
import {
  Entity,
  Column,
  Index,
  BaseEntity,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity()
@Unique(["compoundId"])
export class Account extends BaseEntity {
  constructor(
    fields: Pick<Account, "providerId" | "providerAccountId"> &
      Partial<Account>,
  ) {
    super()
    Object.assign(this, fields)
    this.compoundId = createHash("sha256")
      .update(`${this.providerId}:${this.providerAccountId}`)
      .digest("hex")
  }

  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column("character varying")
  compoundId: string

  @Index()
  @Column("uuid")
  userId!: string

  @Column("character varying")
  providerType!: string

  @Index()
  @Column("character varying")
  providerId!: string

  @Index()
  @Column("character varying")
  providerAccountId!: string

  @Column({ type: "character varying", nullable: true })
  refreshToken?: string

  @Column({ type: "character varying", nullable: true })
  accessToken?: string

  @Column({ type: "timestamp without time zone", nullable: true, default: () => "NOW() + interval '1 hour'" })
  accessTokenExpires?: Date

  @CreateDateColumn()
  createDate!: Date

  @UpdateDateColumn()
  updateDate!: Date
}
