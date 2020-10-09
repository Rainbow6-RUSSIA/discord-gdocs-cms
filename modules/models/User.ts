import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class User extends BaseEntity { // TypeORM.Models.User.model
  constructor (fields?: Partial<User>) {
    super();
    Object.assign(this, fields);
  }

  @PrimaryGeneratedColumn("uuid")
  id!: string

  @CreateDateColumn()
  createDate!: Date

  @UpdateDateColumn()
  updateDate!: Date
}