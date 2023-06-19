import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CheckEmail {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  iv: string;
  @Column()
  encryptedData: string;
}
