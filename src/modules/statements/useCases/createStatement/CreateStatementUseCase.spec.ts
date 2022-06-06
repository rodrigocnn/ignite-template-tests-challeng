import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError";

let statementsRepositoryInMemory : InMemoryStatementsRepository
let userRepositoryInMemory: InMemoryUsersRepository 
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe("Statement", ()=>{

    beforeEach(()=>{
        userRepositoryInMemory = new InMemoryUsersRepository()
        statementsRepositoryInMemory = new InMemoryStatementsRepository()
        createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementsRepositoryInMemory)
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
    })
    
    it("Should be able to create a statement of type deposit", async ()=>{
        
        const user: ICreateUserDTO = {
            email: "user@teste.com",
            password: "1234",
            name: "User Test",
          };

        const userCreated = await createUserUseCase.execute(user);
        const user_id = userCreated.id as string
        const statement = {user_id,type: "deposit" as OperationType, amount: 100, description: "DINDIN"}
        const result = await createStatementUseCase.execute(statement)
        expect(result.amount).toEqual(100)
        
    })


    it("Should be able to create a statement of type withdraw", async ()=>{
        
        const user: ICreateUserDTO = {
            email: "user@teste.com",
            password: "1234",
            name: "User Test",
          };

        const userCreated = await createUserUseCase.execute(user);
        const user_id = userCreated.id as string
        const deposit  = {user_id,type: "deposit" as OperationType, amount: 100, description: "DINDIN"}
        const withdraw = {user_id,type: "withdraw" as OperationType, amount: 50, description: "DINDIN"}
        await createStatementUseCase.execute(deposit)
        const result =  await createStatementUseCase.execute(withdraw )
        expect(result.amount).toEqual(50)
        

   
    })

    it("Should be not able to create a statement if user not exist", async ()=>{
      expect(async () => {
        const deposit  = {user_id:'xxxx',type: "deposit" as OperationType, amount: 100, description: "DINDIN"}
        await createStatementUseCase.execute(deposit)
      
      }).rejects.toBeInstanceOf(new CreateStatementError.UserNotFound());
    })

    it("Should be not able to create a statement of type withdraw if balance < amount", async ()=>{
      expect(async () => {
       
        const user: ICreateUserDTO = {
          email: "user@teste.com",
          password: "1234",
          name: "User Test",
        };

      const userCreated = await createUserUseCase.execute(user);
      const user_id = userCreated.id as string
      const withdraw = {user_id,type: "withdraw" as OperationType, amount: 50, description: "DINDIN"}
      await createStatementUseCase.execute(withdraw )
    
      }).rejects.toBeInstanceOf(new CreateStatementError.InsufficientFunds());
    })


})