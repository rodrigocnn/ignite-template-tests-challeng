import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";


let userRepositoryInMemory: InMemoryUsersRepository 
let createUserUseCase: CreateUserUseCase

describe("Statement", ()=>{

    beforeEach(()=>{
        userRepositoryInMemory = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
    })
    
    it("Should be able to create a new user ", async ()=>{
        
        const user: ICreateUserDTO = {
            email: "user@teste.com",
            password: "1234",
            name: "User Test",
          };

        const userCreated = await createUserUseCase.execute(user);
        expect(userCreated.email).toEqual("user@teste.com")
        
    })



  it('Should not be able to create a new user if user AlreadyExists ', async ()=>{
    expect( async ()=>{
      const user: ICreateUserDTO = {
        email: "user@teste.com",
        password: "1234",
        name: "User Test",
      };

     await createUserUseCase.execute(user);
     await createUserUseCase.execute(user);

    }).rejects.toBeInstanceOf(AppError)
    
 })

   
})