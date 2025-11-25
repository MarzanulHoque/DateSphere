import { Component, HostListener, Inject, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableMember, Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe,FormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css'
})
export class MemberProfile implements OnDestroy, OnInit{
  @ViewChild('editForm') editform?:NgForm;

  @HostListener('window:beforeunload',['$event']) notify($event:BeforeUnloadEvent)
  {
    if(this.editform?.dirty)
    {
      $event.preventDefault(); 
    }
  }
  
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  protected memberService = inject(MemberService);
  private accountService = inject(AccountService);
  protected editableMember: EditableMember = {
    displayName:'',
    description:'',
    city:'',
    country:''
  };
  
  ngOnInit(): void {
     this.editableMember = 
      {
        displayName : this.memberService.member()?.displayName || '',
        description : this.memberService.member()?.description || '',
        city : this.memberService.member()?.city || '',
        country : this.memberService.member()?.country || ''
      } 
  }
  

  updateProfile()
  {
    if(!this.memberService.member())
      return;

    const updatedMember = { ...this.memberService.member(), ...this.editableMember}
    this.memberService.updateMember(this.editableMember).subscribe(
      {
        next: () =>
        {

          const currentUser = this.accountService.currentUser();

          if(currentUser && updatedMember.displayName != currentUser.displayName)
          {
              currentUser.displayName = updatedMember.displayName;
              this.accountService.setCurrentUser(currentUser);
          }

          this.toast.success("User Updated Successfully");
          this.memberService.member.set(updatedMember as Member)
          this.memberService.editMode.set(false);
          this.editform?.reset(updatedMember);
        }
      }
    );

  }
  ngOnDestroy(): void {
    if(this.memberService.editMode())
    {
      this.memberService.editMode.set(false);
    }
  }

}
