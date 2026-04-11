<template>
	<div>
		<h1>Home</h1>
		<ShadcnButton class="" size="lg" @click="() => toast('Hello world!')">
			Click me
		</ShadcnButton>

		 <ShadcnDrawer>
    <ShadcnDrawerTrigger>Open</ShadcnDrawerTrigger>
    <ShadcnDrawerContent>
      <ShadcnDrawerHeader>
        <ShadcnDrawerTitle>Are you absolutely sure?</ShadcnDrawerTitle>
        <ShadcnDrawerDescription>
          This action cannot be undone.
					SOSI PICY
        </ShadcnDrawerDescription>
      </ShadcnDrawerHeader>
      <ShadcnDrawerFooter>
        <ShadcnButton>Submit</ShadcnButton>
        <ShadcnDrawerClose>
          <ShadcnButton variant="outline">
            Cancel
          </ShadcnButton>
        </ShadcnDrawerClose>
      </ShadcnDrawerFooter>
    </ShadcnDrawerContent>
  </ShadcnDrawer>
	</div>
</template>

<script lang="ts" setup>
import { toast } from "vue-sonner";
</script>

