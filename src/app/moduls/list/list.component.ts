import { HttpErrorResponse } from '@angular/common/http';
import {  AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of, Subject, Subscription, takeUntil, tap, window } from 'rxjs';
import { IUser } from 'src/app/interfaces/interface.user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})



export class ListComponent implements OnInit,AfterViewInit,OnDestroy{
   
  private page:number=1;
  private itemPrePage:number=10; 
  public  users:IUser[]=[];
  public allUsers:number=0;
  private windowHeight:number=0;
  private elementCards?:any;
  private controler:boolean=false;
  
  
  
  private subscription:Subscription=new Subscription();

  @ViewChild("cards",{static:false}) "cardsRef":ElementRef;
  
  

  constructor(
    private userService:UserService
    ) {}
    
    
  
  
   ngOnInit():void  {  
    // this.userService.getAll().subscribe(data => this.allUsers=data.length) 
    this.getUsers(this.page,this.itemPrePage); 
    this.windowHeight=this.userService.height    
  }  

  ngAfterViewInit(): void {
    this.elementCards=this.cardsRef.nativeElement
  }

   
  getUsers(page:number,itemPrePage:number):void{          
    let newUsers:IUser[]=[]; 
    this.subscription.add(
      this.userService.getPart(page,itemPrePage)
      .subscribe({
       next:data=>{        
             newUsers=data.map((u:IUser)=>u)
             this.users=[...this.users,...newUsers]
             this.controler=!this.controler;                                      
           },
       error: error=>alert(error.statusText)        
       }
     )       
    )   
  }
        
   @HostListener('window:scroll', ['$event'])
    onScroll(event: any) {    
      if(this.elementCards.getBoundingClientRect().y+this.elementCards.getBoundingClientRect().height-100<=this.windowHeight&&this.controler){                
        this.page+=1;
        this.controler=!this.controler;
        this.getUsers(this.page,this.itemPrePage)    
      } 
    }
           

      ngOnDestroy(): void {
       this.subscription.unsubscribe();
      }

}
