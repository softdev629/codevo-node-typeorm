import crypto from "crypto";
import { Entity, Column, Index, BeforeInsert, OneToMany } from "typeorm";
import bcrypt from "bcryptjs";
import Model from "./model.entity";
import { Post } from "./post.entity";

export enum RoleEnumType {
  USER = "user",
  ADMIN = "admin",
}

@Entity("users")
export class User extends Model {
  @Column()
  name: string;

  @Index("email_index")
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: RoleEnumType,
    default: RoleEnumType.USER,
  })
  role: RoleEnumType;

  @Column({
    default: "default.png",
  })
  photo: string;

  @Column({
    default: false,
  })
  verified: boolean;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @Index("verificationCode_index")
  @Column({ type: "text", nullable: true })
  verificationCode!: string | null;

  toJSON() {
    return {
      ...this,
      password: undefined,
      verified: undefined,
    };
  }

  // Hash password before saving to database
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  // Validate password
  static async comparePasswords(
    candidatePassword: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  static createVerificationCode() {
    const verificationCode = crypto.randomBytes(32).toString("hex");

    const hashedVerificationCode = crypto
      .createHash("sha256")
      .update(verificationCode)
      .digest("hex");

    return { verificationCode, hashedVerificationCode };
  }
}
