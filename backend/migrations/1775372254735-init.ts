import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1775372254735 implements MigrationInterface {
    name = 'Init1775372254735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "concerts" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "total_seats" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6ca96059628588a3988a5f3236a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."reservation_logs_action_enum" AS ENUM('reserve', 'cancel')`);
        await queryRunner.query(`CREATE TABLE "reservation_logs" ("id" SERIAL NOT NULL, "action" "public"."reservation_logs_action_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "concert_id" integer, CONSTRAINT "PK_74871dcf9ed2c7df8d0519d6645" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reservations" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "concert_id" integer, CONSTRAINT "UQ_50589dfdc361b585e3b57d047c3" UNIQUE ("user_id", "concert_id"), CONSTRAINT "PK_da95cef71b617ac35dc5bcda243" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reservation_logs" ADD CONSTRAINT "FK_4b183a22277e550da831f21bf74" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation_logs" ADD CONSTRAINT "FK_180ac7f5811bcd8640e14952f0b" FOREIGN KEY ("concert_id") REFERENCES "concerts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_4af5055a871c46d011345a255a6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_ff30cfc107bad916b328fa31c50" FOREIGN KEY ("concert_id") REFERENCES "concerts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_ff30cfc107bad916b328fa31c50"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_4af5055a871c46d011345a255a6"`);
        await queryRunner.query(`ALTER TABLE "reservation_logs" DROP CONSTRAINT "FK_180ac7f5811bcd8640e14952f0b"`);
        await queryRunner.query(`ALTER TABLE "reservation_logs" DROP CONSTRAINT "FK_4b183a22277e550da831f21bf74"`);
        await queryRunner.query(`DROP TABLE "reservations"`);
        await queryRunner.query(`DROP TABLE "reservation_logs"`);
        await queryRunner.query(`DROP TYPE "public"."reservation_logs_action_enum"`);
        await queryRunner.query(`DROP TABLE "concerts"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
