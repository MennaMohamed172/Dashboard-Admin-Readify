import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopounComponent } from './copoun.component';

describe('CopounComponent', () => {
  let component: CopounComponent;
  let fixture: ComponentFixture<CopounComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopounComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CopounComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
