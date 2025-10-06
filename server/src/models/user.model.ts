import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Round } from './round.model';
import { Score } from './score.model';

@Table({
  tableName: 'users',
  timestamps: false,
})
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  })
  login: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password_hash: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role: string;

  @HasMany(() => Score)
  scores: Score[];
}

export default User;
