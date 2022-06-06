import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase"


let getBalanceUseCase  : GetBalanceUseCase;
let statementsRepositoryInMemory : InMemoryStatementsRepository
let userRepositoryInMemory: InMemoryUsersRepository 
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe(" Balance Statement", ()=>{

    beforeEach(()=>{
        userRepositoryInMemory = new InMemoryUsersRepository()
        statementsRepositoryInMemory = new InMemoryStatementsRepository()
        createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementsRepositoryInMemory)
        getBalanceUseCase  =  new GetBalanceUseCase(statementsRepositoryInMemory, userRepositoryInMemory)
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
    })
    
    it("Should to return all operations of deposit and withdraw", async ()=>{
        
        const user: ICreateUserDTO = {
            email: "user@teste.com",
            password: "1234",
            name: "User Test",
          };

        const userCreated = await createUserUseCase.execute(user);
        const user_id = userCreated.id as string
        const statement = {user_id,type: "deposit" as OperationType, amount: 100, description: "DINDIN"}
        await createStatementUseCase.execute(statement)

        const balance = await getBalanceUseCase.execute({user_id})
        expect(balance.balance).toEqual(100)
        

   
    })
})