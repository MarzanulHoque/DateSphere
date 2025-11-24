import { Component, HostListener, Inject, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableMember, Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';

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
  protected member = signal<Member | undefined>(undefined);
  protected memberService = inject(MemberService);
  protected editableMember: EditableMember = {
    displayName:'',
    description:'',
    city:'',
    country:''
  };
  
  ngOnInit(): void {
    this.route.parent?.data.subscribe( data => 
      {
        this.member.set(data['member']);
      }
    )
     
     this.editableMember = 
      {
        displayName : this.member()?.displayName || '',
        description : this.member()?.description || '',
        city : this.member()?.city || '',
        country : this.member()?.country || ''
      } 
  }
  

  updateProfile()
  {
    if(!this.member())
      return;

    const updatedMember = { ...this.member(), ...this.editableMember}
    this.memberService.updateMember(this.editableMember).subscribe(
      {
        next: () =>
        {
          this.toast.success("User Updated Successfully");
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
