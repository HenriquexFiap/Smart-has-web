import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Triagem } from './triagem.component';

describe('Triagem', () => {
  let component: Triagem;
  let fixture: ComponentFixture<Triagem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Triagem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Triagem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
