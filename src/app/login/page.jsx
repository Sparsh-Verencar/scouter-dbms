"use client"
import React from 'react'
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
const page = () => {
  return (
    <>
    <InputGroup>
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
              <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
              <InputGroupButton>Search</InputGroupButton>
          </InputGroupAddon>
      </InputGroup><Button onClick={() => router.push("/freelancer-dashboard")}>
              sparsh vaibhav balaji
          </Button>
          </>
  )
}

export default page