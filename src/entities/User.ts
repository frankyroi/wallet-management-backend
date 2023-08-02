import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Wallet } from "./Wallet";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: false })
  isAdmin!: boolean;

  @Column({ default: false })
  isActive!: boolean;

  @Column()
  invitationToken!: string;
  

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets!: Wallet[];
}