import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let userRepositoryInMemory: InMemoryUsersRepository 
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase : AuthenticateUserUseCase


describe("Sessions ", ()=>{

    beforeEach(()=>{
        userRepositoryInMemory = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
        authenticateUserUseCase = new AuthenticateUserUseCase( userRepositoryInMemory)
    })
    
    it("Should be able to authenticate an user ", async ()=>{
        
        const user: ICreateUserDTO = {
            email: "user@teste.com",
            password: "1234",
            name: "User Test",
          };

        
        await createUserUseCase.execute(user);

        const session = await authenticateUserUseCase.execute({
          email: user.email,
          password: user.password,
        });

        expect(session).toHaveProperty("token");
        
    })

    it("should not be able to authenticate with incorrect password ", async ()=>{
      
      expect( async ()=>{
        const user: ICreateUserDTO = {
          email: "user@teste.com",
          password: "1234",
          name: "User Test",
        };

      await createUserUseCase.execute(user);

      const session = await authenticateUserUseCase.execute({
        email: user.email,
        password: "12345",
      });

      }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);;
      
  })


    it("should not be able to authenticate an non existent user", async () => {
      expect(async () => {
        await authenticateUserUseCase.execute({
          email: "fake@email.com",
          password: "1234",
        });
      }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });


   
})