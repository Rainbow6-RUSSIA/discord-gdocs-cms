import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity()
export class User extends BaseEntity {
  constructor(fields?: Partial<User>) {
    super()
    Object.assign(this, fields)
  }

  @PrimaryGeneratedColumn("uuid")
  id!: string

  @CreateDateColumn()
  createDate!: Date

  @UpdateDateColumn()
  updateDate!: Date
}
