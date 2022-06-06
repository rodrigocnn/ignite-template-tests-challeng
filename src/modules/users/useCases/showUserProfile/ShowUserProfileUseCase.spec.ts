import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let userRepositoryInMemory: InMemoryUsersRepository 
let createUserUseCase: CreateUserUseCase
let showUserProfileUseCase: ShowUserProfileUseCase

describe("Profile ", ()=>{

    beforeEach(()=>{
        userRepositoryInMemory = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
        showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory)
    })
    
    it("Should be ableShould be able to show user by id ", async ()=>{
        
      const user: ICreateUserDTO = {
          email: "user@teste.com",
          password: "1234",
          name: "User Test",
        };

      const userCreated = await createUserUseCase.execute(user);
      const result = await showUserProfileUseCase.execute(userCreated.id as string)
      expect(result.email).toBe(user.email);
        
    })


    it("should not be able to show user by id if id non exist", async () => {
      expect(async () => {
        await showUserProfileUseCase.execute('14kdsds3');
      }).rejects.toBeInstanceOf(ShowUserProfileError);
    });

   
})